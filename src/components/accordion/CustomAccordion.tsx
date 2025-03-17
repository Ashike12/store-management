import {useState} from 'react';
import cn from '@core/utils/cn';
import {IconChevronDown, IconChevronUp} from '@tabler/icons-react';
import {IAccordionConfiguration} from '@core/interfaces/accordion-config';
import CustomAccordionSection from './CustomAccordionSection';
import TextWrapper from '@components/text/TextWrapper';

interface ICustomAccordionProps {
  accordionTitle: string;
  accordionConfiguration: IAccordionConfiguration;
  accordionTitleAmount?: string;
  className?: string;
}

export default function CustomAccordion({
  accordionTitle,
  accordionTitleAmount,
  accordionConfiguration,
  className,
}: Readonly<ICustomAccordionProps>) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div
      className={cn(
        'bg-transparent-grey-8 relative flex flex-col items-start gap-4 rounded p-3',
        className,
      )}>
      <div className="flex w-full items-center justify-between">
        <TextWrapper content={accordionTitle} variant={'Subtitle1'} />
        {accordionTitleAmount && (
          <TextWrapper content={accordionTitleAmount} variant={'Subtitle1'} />
        )}
      </div>
      <CustomAccordionSection
        accordionSection={accordionConfiguration.sections[0]}
      />
      {/* Expandable Sections */}
      <div
        className={cn(
          'flex w-full flex-col gap-4 overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0',
        )}>
        {accordionConfiguration.sections.slice(1).map(section => (
          <CustomAccordionSection
            key={section.accordionSectionId}
            accordionSection={section}
          />
        ))}
      </div>
      <button
        className="bg-grey-grey-100 absolute right-[50%] bottom-[-13px] flex h-8 w-8 items-center justify-center rounded-full"
        onClick={toggleAccordion}>
        {isExpanded ? (
          <IconChevronUp size={14} className="text-[#212B36]" />
        ) : (
          <IconChevronDown size={14} className="text-[#212B36]" />
        )}
      </button>
    </div>
  );
}
