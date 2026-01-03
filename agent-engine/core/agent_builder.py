import os
import json

class AgentBuilder:
    def __init__(self, agents_dir):
        self.agents_dir = agents_dir
        os.makedirs(agents_dir, exist_ok=True)

    def create_agent(self, name, description, model="gpt-4o", tools=None):
        agent_id = name.lower().replace(" ", "-")
        agent_data = {
            "id": agent_id,
            "name": name,
            "description": description,
            "model": model,
            "tools": tools or [],
            "status": "ready"
        }
        
        path = os.path.join(self.agents_dir, f"{agent_id}.json")
        with open(path, 'w') as f:
            json.dump(agent_data, f, indent=2)
            
        return agent_data

    def get_agent(self, agent_id):
        path = os.path.join(self.agents_dir, f"{agent_id}.json")
        if not os.path.exists(path):
            return None
        with open(path, 'r') as f:
            return json.load(f)
