
import { useEffect } from 'react';
 
export function useBodyAttributes(classNames: string, id?: string) {
  useEffect(() => {
    if (id) {
      document.body.id = id;
    }
    document.body.className = classNames.trim();  // Ensure no extra spaces
  }, [classNames, id]);
}
 
export function useHtmlAttributes(classNames: string, id?: string) {
  useEffect(() => {
    if (id) {
      document.documentElement.id = id;
    }
    document.documentElement.className = classNames.trim();  // Ensure no extra spaces
  }, [classNames, id]);
}

// Add the missing useDocumentAttributes function
export function useDocumentAttributes({ 
  title, 
  description 
}: { 
  title?: string; 
  description?: string;
}) {
  useEffect(() => {
    // Update document title if provided
    if (title) {
      document.title = title;
    }
    
    // Update meta description if provided
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'description';
        newMeta.content = description;
        document.head.appendChild(newMeta);
      }
    }
  }, [title, description]);
}
