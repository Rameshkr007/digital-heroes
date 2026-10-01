import axios from 'axios';
import { prisma } from '../utils/prisma';

export interface AIMentorMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateAIMentorAdvice(
  userId: string,
  userMessage: string,
  conversationHistory: AIMentorMessage[] = []
): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          skills: { include: { skill: true } },
          achievements: true,
          projects: true,
        },
      },
    },
  });

  if (!user || !user.profile) {
    throw new Error('User profile not found');
  }

  const p = user.profile;
  const skillsList = p.skills.map((s) => s.skill.name).join(', ') || 'General Development';
  const achievementsCount = p.achievements.length;
  const projectsCount = p.projects.length;

  const systemPrompt = `You are "HeroBot AI", an elite AI Career Mentor for Digital Heroes platform.
User Context:
- Name: ${p.displayName}
- Current Level: ${p.level} (${p.xp} XP)
- Title: ${p.title}
- Skills: ${skillsList}
- Total Achievements: ${achievementsCount}
- Projects Built: ${projectsCount}

Goal: Provide inspiring, highly actionable, concise career guidance, project suggestions, and roadmap advice tailored to this user's tech stack and level. Keep response under 180 words. Use bullet points and emojis where helpful.`;

  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (apiKey && process.env.GEMINI_API_KEY) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Question: ${userMessage}` }],
            },
          ],
        },
        { timeout: 10000 }
      );

      const candidateText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidateText) return candidateText.trim();
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart local AI engine');
    }
  }

  // Fallback Smart AI Mentor Engine (Always works out-of-the-box)
  return generateSmartFallbackAdvice(p, userMessage);
}

function generateSmartFallbackAdvice(p: any, message: string): string {
  const msgLower = message.toLowerCase();
  const name = p.displayName.split(' ')[0];
  const nextLevel = p.level + 1;
  const xpNeeded = (nextLevel - 1) * 1000 - p.xp;

  if (msgLower.includes('level') || msgLower.includes('xp') || msgLower.includes('rank')) {
    return `Hey ${name}! 🚀 To reach **Level ${nextLevel}**, you need approximately **${Math.max(xpNeeded, 150)} more XP**.
    
Here are 3 fast ways to earn XP right now:
1. ⚡ **Sync GitHub:** Connect your repositories for up to +500 XP bonus.
2. 🏆 **Complete Technical Achievements:** Submit open-source tools or deploy 2 new full-stack apps.
3. 💬 **Get Skill Endorsements:** Collaborate with fellow heroes in community projects.`;
  }

  if (msgLower.includes('project') || msgLower.includes('idea') || msgLower.includes('build')) {
    return `Hey ${name}! Based on your current stack, here are 2 high-impact projects that will boost your profile:
    
- 🧠 **AI-Powered Code Reviewer Bot:** Build a CLI or GitHub App that analyzes pull requests using Gemini API.
- ⚡ **Real-time Collaboration Canvas:** Create a WebSockets-enabled whiteboard tool with React & Socket.io.
    
Deploying either project will earn you **+400 XP** and the *Innovation Hero* badge!`;
  }

  return `Hello ${name}! 👋 As a **${p.title} (Level ${p.level})**, your progress is looking strong!
  
🎯 **Next Milestones for You:**
- Expand your portfolio with a production-ready Web3 or AI project.
- Aim for 5+ verified achievements to unlock the *Code Wizard* badge.
- Sync your latest GitHub activity on your Dashboard to claim bonus XP.

How else can I assist your hero journey today?`;
}
