REFLECTION – “VividPath”
Our project was built during the MLH CrimsonCode Hackathon. 
The expectation of a hackathon is to build and present a project under a theme within a strict 24-hour time window. 
The theme for this event was: “Reinvent the wheel”, our team decided to build an AI-powered trip planner: a web app where users 
are prompted to describe a destination and travel preferences (total days, budget, etc.,) and receive a personalized itinerary in return. 

Technical Decisions
The most significant technical decision was choosing Google’s Gemini API as the AI backbone of the app. For the frontend stack, 
we went with React and Typescript. We had all used these in prior projects and felt comfortable with them. We used Vite as the build tool for the same reason. 
If I had to revisit one decision we made, I’d change how we handled prompt engineering on the Gemini API integration. Due to time constraints, 
we kept the system prompt relatively simple, and this led to inconsistent response formatting that would sometimes complicate how the results rendered in the UI. 
A structured output scheme would likely have made the frontend rendering cleaner. 

 Contributions
I worked in a team of three. The bulk of my contributions were for: 
-	Gemini API integration: set up the API, designed the prompt structure, handled bad responses, etc., 
-	Frontend / UI design: built reusable UI components, designed responsive UI, handled user input flow, etc., 

Quality Assessment
By the time the hackathon ended, our project was mostly incomplete. The basic functionality of the app worked, 
but we were unable to complete most of what we wanted to do.. 
If I were to redo the hackathon, I would spend less time trying to come up with an idea for a project. We spent 2-3 hours debating ideas, 
features, and scope. This time would have been better spent elsewhere. Furthermore, I’d prioritize getting to a minimum viable product first, 
and let the rest come after that. I’d also prioritize the prompt engineering and output parsing much earlier in development, 
since that bottlenecked a lot of the frontend work. 
Overall, participating in the Hackathon was a valuable experience and taught us a lot about working under pressure. 

