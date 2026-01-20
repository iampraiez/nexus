'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, FileText, ExternalLink } from 'lucide-react';

const docSections = [
  {
    title: 'Getting Started',
    description: 'Installation and setup guide for the SDK',
    icon: FileText,
  },
  {
    title: 'API Reference',
    description: 'Complete API reference documentation',
    icon: Code,
  },
  {
    title: 'Examples',
    description: 'Code examples and integration patterns',
    icon: Code,
  },
];

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Documentation</h1>
        <p className="text-muted-foreground">
          Learn how to integrate and use the Analytics SDK
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {docSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="p-6 border border-border bg-card">
              <Icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {section.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {section.description}
              </p>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                Read <ExternalLink className="w-4 h-4" />
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 border border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Quick Install
        </h2>
        <div className="bg-secondary/50 rounded p-4 font-mono text-sm mb-4">
          <code className="text-foreground">
            npm install @analytics-saas/sdk
          </code>
        </div>
        <h3 className="font-semibold text-foreground mb-2">Initialize</h3>
        <pre className="bg-secondary/50 rounded p-4 text-sm font-mono text-foreground overflow-auto">
          {`import Analytics from '@analytics-saas/sdk';

const analytics = Analytics.init({
  apiKey: 'your-api-key',
  environment: 'production'
});`}
        </pre>
      </Card>
    </div>
  );
}
