import re
import json

class NaturalLanguageParser:
    def __init__(self):
        self.intent_patterns = {
            'create_agent': r'(create|build|make)\s+(a|an)?\s+agent\s+(named|called)?\s+(?P<name>[\w\- ]+)',
            'define_tool': r'(define|add)\s+(a|an)?\s+tool\s+(called|named)?\s+(?P<name>[\w\- ]+)\s+that\s+(?P<desc>.+)',
            'create_workflow': r'(create|setup)\s+(a|an)?\s+workflow\s+(named|called)?\s+(?P<name>[\w\- ]+)'
        }

    def parse(self, text):
        for intent, pattern in self.intent_patterns.items():
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return {
                    'intent': intent,
                    'params': match.groupdict(),
                    'original': text
                }
        return {'intent': 'unknown', 'params': {}, 'original': text}

if __name__ == "__main__":
    parser = NaturalLanguageParser()
    result = parser.parse("Create an agent named Researcher")
    print(json.dumps(result, indent=2))
