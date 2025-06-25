'use client';

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import 'mathlive';

// Define the MathfieldElement type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

// Define the MathfieldElement interface
export interface MathfieldElement extends HTMLElement {
  value: string;
  getValue(format?: string): string;
  setValue(value: string): void;
  insert(text: string, options?: { focus?: boolean; feedback?: boolean; }): void;
  focus(): void;
  blur(): void;
  select(): void;
}

// Define the props for the MathField component
export interface MathFieldProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Define the ref interface for users of the MathField component
export interface MathFieldRef {
  setValue: (value: string) => void;
  getValue: () => string;
  focus: () => void;
  blur: () => void;
  insert: (text: string) => void;
}

// Implement the MathField component according to the official MathLive React documentation
export const MathField = forwardRef<MathFieldRef, MathFieldProps>(({ 
  value, 
  onChange, 
  placeholder, 
  disabled,
  className,
  style,
  ...props
}, ref) => {
  const mathFieldRef = useRef<HTMLElement>(null);
  
  // Disable all sounds globally - do this once before any mathfields are created
  useEffect(() => {
    // @ts-ignore - Static properties not recognized by TypeScript
    if (typeof window !== 'undefined' && window.MathfieldElement) {
      // @ts-ignore
      window.MathfieldElement.soundsDirectory = null;
    }
  }, []);
  
  // Setup the mathfield on mount
  useEffect(() => {
    if (!mathFieldRef.current) return;
    
    // Listen for input events
    const handleInput = (evt: Event) => {
      if (onChange && evt.target) {
        // @ts-ignore - We know this is a MathfieldElement
        onChange((evt.target as HTMLElement).value);
      }
    };
    
    // Add event listeners
    mathFieldRef.current.addEventListener('input', handleInput);
    
    // Initial configuration
    if (placeholder) {
      mathFieldRef.current.setAttribute('placeholder', placeholder);
    }
    
    // Configure disabled state
    if (disabled) {
      mathFieldRef.current.setAttribute('disabled', 'true');
    }
    
    // Configure for math input
    mathFieldRef.current.setAttribute('virtual-keyboard-mode', 'off');
    mathFieldRef.current.setAttribute('smart-mode', 'true');
    mathFieldRef.current.setAttribute('smart-fence', 'true');
    
    // Clean up on unmount
    return () => {
      if (mathFieldRef.current) {
        mathFieldRef.current.removeEventListener('input', handleInput);
      }
    };
  }, [onChange, placeholder, disabled]);
  
  // Update disabled state when it changes
  useEffect(() => {
    if (!mathFieldRef.current) return;
    
    if (disabled) {
      mathFieldRef.current.setAttribute('disabled', 'true');
    } else {
      mathFieldRef.current.removeAttribute('disabled');
    }
  }, [disabled]);
  
  // Update placeholder when it changes
  useEffect(() => {
    if (!mathFieldRef.current || !placeholder) return;
    mathFieldRef.current.setAttribute('placeholder', placeholder);
  }, [placeholder]);
  
  // Expose imperative methods via ref
  useImperativeHandle(ref, () => ({
    setValue: (value: string) => {
      if (mathFieldRef.current) {
        // @ts-ignore - We know this is a MathfieldElement
        mathFieldRef.current.value = value;
      }
    },
    getValue: () => {
      // @ts-ignore - We know this is a MathfieldElement
      return mathFieldRef.current ? mathFieldRef.current.value : '';
    },
    focus: () => {
      // @ts-ignore - We know this is a MathfieldElement
      mathFieldRef.current?.focus();
    },
    blur: () => {
      // @ts-ignore - We know this is a MathfieldElement
      mathFieldRef.current?.blur();
    },
    insert: (text: string) => {
      // @ts-ignore - We know this is a MathfieldElement
      mathFieldRef.current?.insert(text, { focus: true });
    }
  }));
  
  return (
    <math-field 
      ref={mathFieldRef}
      className={`w-full p-4 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 min-h-[130px] md:min-h-[150px] ${className || ''}`}
      style={{
        ...(style || {}),
        fontSize: '18px', // Larger font size for better readability
        ...({
          '--keyboard-toggle-size': '160%', // Larger keyboard toggle button for touch
          '--keyboard-key-padding': '0.5em 0.3em', // More padding for touch targets on mobile
          '--keyboard-key-radius': '6px', // Rounded keys for better mobile UX
        } as React.CSSProperties)
      }}
      {...props}
    >
      {value || ''}
    </math-field>
  );
});

MathField.displayName = 'MathField';

export default MathField;
