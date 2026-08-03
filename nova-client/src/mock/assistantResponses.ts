import { Message } from "../types/assistant.types";

export const mockAssistantResponses: Record<string, string> = {
  "plan my day": `I've analyzed your schedule and priorities for today. Here's your optimized plan:

**Morning (9:00 AM - 12:00 PM)**
- 9:00 AM: Review daily goals and priorities
- 10:00 AM: Deep work session - Nova Architecture Review
- 11:30 AM: Team standup meeting

**Afternoon (1:00 PM - 5:00 PM)**
- 1:00 PM: Lunch break
- 2:00 PM: Focus on React component development
- 3:30 PM: Code review session
- 4:30 PM: Documentation updates

**Evening (5:00 PM - 7:00 PM)**
- 5:00 PM: Wrap up and review progress
- 6:00 PM: Personal time

I've prioritized your most important tasks and grouped similar activities together for better focus. Would you like me to adjust anything?`,

  "summarize my notes": `Here's a summary of your recent notes:

**Key Themes:**
- Nova Architecture (3 notes)
- Business Planning (2 notes)
- Startup Ideas (2 notes)
- Weekly Planning (1 note)
- Productivity Tips (1 note)

**Recent Highlights:**
- Nova is an AI-powered Daily Operating System designed to help users manage daily tasks, goals, finances, and knowledge
- The architecture consists of multiple modules including Today, Goals, Finance, Documents, and Notes
- You're focusing on MVP development with React, TypeScript, and Redux Toolkit

**Connections:**
Your architecture notes connect with your business planning and startup ideas. Consider creating a dedicated "Nova Development" folder to organize these related notes.

Would you like me to create a summary document or find specific information?`,

  "show today's tasks": `Here are your tasks for today:

**High Priority**
- [ ] Review Nova architecture documentation
- [ ] Complete React component for Notes module
- [ ] Prepare for team standup

**Medium Priority**
- [ ] Update project documentation
- [ ] Review pull requests
- [ ] Schedule weekly planning session

**Low Priority**
- [ ] Organize project files
- [ ] Update dependencies

**Progress:**
- 0/3 high priority completed
- 0/3 medium priority completed
- 0/2 low priority completed

I recommend starting with the architecture review since it's foundational for your other tasks. Would you like me to help you break down any of these tasks?`,

  "create a new goal": `I'll help you create a new goal. Here's a template based on your existing goals:

**Goal Details:**
- Title: [Enter goal title]
- Category: Work / Personal / Health / Finance / Learning
- Priority: High / Medium / Low
- Deadline: [Set target date]

**Milestones:**
1. [First milestone]
2. [Second milestone]
3. [Third milestone]

**Success Metrics:**
- [Define measurable outcomes]
- [Set tracking frequency]

Would you like me to:
1. Create a goal based on your current priorities?
2. Help you brainstorm goal ideas?
3. Set up a goal from one of your notes?`,

  "schedule a meeting": `I can help you schedule a meeting. Here's what I need:

**Meeting Details:**
- Title: [Meeting purpose]
- Date: [Preferred date]
- Time: [Preferred time]
- Duration: [30 min / 1 hour / Custom]
- Attendees: [List participants]

**Available Slots Today:**
- 10:00 AM - 11:00 AM
- 2:00 PM - 3:00 PM
- 4:00 PM - 5:00 PM

**Upcoming Conflicts:**
- Team standup at 11:30 AM
- Code review at 3:30 PM

Would you like me to:
1. Schedule in one of the available slots?
2. Find a different date?
3. Send calendar invites?`,

  "review my finances": `Here's your financial overview:

**Income This Month:**
- Salary: $5,000
- Freelance: $1,200
- Total: $6,200

**Expenses This Month:**
- Rent: $1,500
- Utilities: $200
- Groceries: $400
- Transportation: $150
- Entertainment: $100
- Subscriptions: $50
- Savings: $1,000
- Total: $3,400

**Remaining Budget:**
- Available: $2,800
- Unallocated: $2,800

**Recommendations:**
- You're on track with your savings goal
- Consider allocating more to investments
- Review subscription services for potential savings

Would you like me to:
1. Create a detailed budget?
2. Set up expense tracking?
3. Plan for upcoming expenses?`,

  "generate weekly report": `Here's your weekly report:

**Productivity Summary**
- Tasks Completed: 12/15 (80%)
- Goals Progress: 3/5 on track
- Notes Created: 7
- Meetings Attended: 8

**Key Achievements**
- Completed Nova Notes module UI
- Reviewed 5 pull requests
- Created comprehensive documentation

**Areas for Improvement**
- Task completion rate decreased by 10%
- 2 goals behind schedule
- Need more focused deep work time

**Next Week Priorities**
- Complete Notes module integration
- Catch up on delayed goals
- Improve task management workflow

**Insights**
Your most productive days were Tuesday and Thursday. Consider scheduling important work on these days.

Would you like me to:
1. Set up next week's priorities?
2. Create action items for improvements?
3. Schedule review sessions?`,

  "open recent documents": `Here are your recent documents:

**Recently Viewed**
- Nova Architecture.pdf (2 hours ago)
- Project Roadmap.docx (Yesterday)
- API Reference.md (2 days ago)
- Meeting Notes.docx (3 days ago)

**By Category**
- Technical: 3 documents
- Planning: 2 documents
- Notes: 2 documents

**Quick Actions**
- Open Nova Architecture.pdf
- Edit Project Roadmap
- Create new document

Would you like me to:
1. Open a specific document?
2. Search for documents by keyword?
3. Create a new document?`,

  "create a workout plan": `Based on your preferences and schedule, here's a personalized workout plan:

**Weekly Schedule**
- Monday: Upper Body Strength (45 min)
- Tuesday: Cardio & Core (30 min)
- Wednesday: Lower Body Strength (45 min)
- Thursday: Active Recovery (30 min)
- Friday: Full Body HIIT (40 min)
- Saturday: Long Cardio (60 min)
- Sunday: Rest Day

**Monday - Upper Body**
- Bench Press: 3x10
- Rows: 3x10
- Shoulder Press: 3x10
- Bicep Curls: 3x12
- Tricep Dips: 3x12

**Equipment Needed**
- Dumbbells or resistance bands
- Yoga mat
- Water bottle

**Progress Tracking**
- Start with lighter weights
- Increase by 5% weekly
- Track reps and sets

Would you like me to:
1. Adjust the schedule?
2. Add specific exercises?
3. Set up workout reminders?`,

  "help with project roadmap": `I'll help you create a comprehensive project roadmap for Nova:

**Phase 1: Foundation (Weeks 1-4)**
- Core architecture setup
- Redux state management
- Base UI components
- Authentication system

**Phase 2: Core Modules (Weeks 5-12)**
- Today module
- Goals module
- Finance module
- Documents module
- Notes module

**Phase 3: AI Integration (Weeks 13-16)**
- AI Assistant UI
- Mock AI responses
- Context management
- Knowledge graph

**Phase 4: Polish & Launch (Weeks 17-20)**
- Testing & QA
- Performance optimization
- Documentation
- Beta launch

**Milestones**
- Week 4: MVP foundation complete
- Week 12: All core modules functional
- Week 16: AI features integrated
- Week 20: Production ready

Would you like me to:
1. Break down specific phases?
2. Adjust the timeline?
3. Add dependencies?`,

  "default": `I understand. Let me help you with that. Based on your current context and priorities, here's what I can do:

I can assist you with:
- Planning and scheduling
- Task and goal management
- Document and note organization
- Financial tracking and analysis
- Project management and roadmaps

Could you provide more details about what you'd like to accomplish? I'll tailor my response to your specific needs.`,
};

export const getMockResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes("plan") && lowerQuery.includes("day")) {
    return mockAssistantResponses["plan my day"];
  } else if (lowerQuery.includes("summarize") && lowerQuery.includes("note")) {
    return mockAssistantResponses["summarize my notes"];
  } else if (lowerQuery.includes("task")) {
    return mockAssistantResponses["show today's tasks"];
  } else if (lowerQuery.includes("goal")) {
    return mockAssistantResponses["create a new goal"];
  } else if (lowerQuery.includes("meeting") || lowerQuery.includes("schedule")) {
    return mockAssistantResponses["schedule a meeting"];
  } else if (lowerQuery.includes("finance") || lowerQuery.includes("money") || lowerQuery.includes("budget")) {
    return mockAssistantResponses["review my finances"];
  } else if (lowerQuery.includes("report") || lowerQuery.includes("weekly")) {
    return mockAssistantResponses["generate weekly report"];
  } else if (lowerQuery.includes("document")) {
    return mockAssistantResponses["open recent documents"];
  } else if (lowerQuery.includes("workout") || lowerQuery.includes("exercise") || lowerQuery.includes("fitness")) {
    return mockAssistantResponses["create a workout plan"];
  } else if (lowerQuery.includes("roadmap") || lowerQuery.includes("project")) {
    return mockAssistantResponses["help with project roadmap"];
  }
  
  return mockAssistantResponses["default"];
};
