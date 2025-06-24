import React, { useEffect, useRef } from 'react';
import { MathfieldElement } from 'mathlive';

// The math-virtual-keyboard element is a singleton.
// It is not a module, but a global object.
// We declare it here to make TypeScript happy.
declare const mathVirtualKeyboard: any;

// Define the props for the component
interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MathInput: React.FC<MathInputProps> = ({ value, onChange, disabled, placeholder }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mathfieldRef = useRef<MathfieldElement | null>(null);

  // Effect to initialize and clean up the mathfield
  useEffect(() => {
    if (containerRef.current) {
      // Create a new MathfieldElement instance
      const mfe = new MathfieldElement();

      // --- Keyboard Customization ---
      // 1. Set keyboard policy to manual for programmatic control
      mfe.mathVirtualKeyboardPolicy = 'manual';

      // 2. Define focus/blur handlers to show/hide the keyboard
      const handleFocus = () => {
        // Use 'compact' layout on mobile, 'default' on desktop
        if (window.innerWidth < 768) {
          mathVirtualKeyboard.layouts = ['compact'];
        } else {
          mathVirtualKeyboard.layouts = 'default';
        }
        mathVirtualKeyboard.show();
      };

      const handleBlur = () => {
        mathVirtualKeyboard.hide();
      };

      // 3. Add event listeners
      mfe.addEventListener('focusin', handleFocus);
      mfe.addEventListener('focusout', handleBlur);

      // Set styles directly on the element
      mfe.style.width = '100%';
      mfe.style.minHeight = '8rem';
      mfe.style.padding = '1rem 3rem 1rem 1rem';
      mfe.style.border = '1px solid #e0e7ff';
      mfe.style.borderRadius = '0.75rem';
      mfe.style.outline = 'none';
      mfe.style.color = '#374151';
      mfe.style.setProperty('--placeholder-color', '#9ca3af');

      // Add an event listener for input changes
      mfe.addEventListener('input', (evt) => {
        onChange((evt.target as MathfieldElement).value);
      });

      // Append the mathfield to the container
      containerRef.current.appendChild(mfe);
      mathfieldRef.current = mfe;

      // Cleanup function to remove the element and listeners when the component unmounts
      return () => {
        mfe.removeEventListener('focusin', handleFocus);
        mfe.removeEventListener('focusout', handleBlur);
        if (containerRef.current && mfe) {
          containerRef.current.removeChild(mfe);
        }
      };
    }
  }, [onChange]); // Run this effect only once on mount

  // Effect to sync the value from the parent component
  useEffect(() => {
    if (mathfieldRef.current && mathfieldRef.current.value !== value) {
      mathfieldRef.current.value = value;
    }
  }, [value]);

  // Effect to sync the disabled state
  useEffect(() => {
    if (mathfieldRef.current) {
      mathfieldRef.current.disabled = !!disabled;
    }
  }, [disabled]);

  // Effect to sync the placeholder
  useEffect(() => {
    if (mathfieldRef.current && placeholder) {
      mathfieldRef.current.placeholder = placeholder;
    }
  }, [placeholder]);

  return <div ref={containerRef} />;
};

export default MathInput;
