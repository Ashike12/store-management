import {useState} from 'react';
import cn from '@core/utils/cn';
import {IconChevronDown, IconChevronUp} from '@tabler/icons-react';
import {
  IAccordionConfiguration,
  ICustomAccordionEditAction,
} from '@core/interfaces/accordion-config';
import CustomAccordionSection from './CustomAccordionSection';
import TextWrapper from '@components/text/TextWrapper';

interface ICustomAccordionProps {
  accordionConfiguration: IAccordionConfiguration;
  data: {[key: string]: any};
  className?: string;
  handleEditClick?: (action: ICustomAccordionEditAction) => void;
}

export default function CustomAccordion({
  accordionConfiguration,
  data,
  className,
  handleEditClick,
}: Readonly<ICustomAccordionProps>) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAccordionEditClick = (action: ICustomAccordionEditAction) => {
    if (handleEditClick) {
      handleEditClick(action);
    }
  };

  return (
    <div
      className={cn(
        'bg-transparent-grey-8 relative flex flex-col items-start rounded p-3',
        className,
      )}>
      <div className="flex w-full items-center justify-between pb-4">
        <TextWrapper
          className="text-text-primary"
          content={
            (data[
              accordionConfiguration.accordionTitlePropertyName
            ] as string) ?? accordionConfiguration.accordionTitle
          }
          variant={'Subtitle1'}
        />
        {accordionConfiguration.accordionTitleAmount && (
          <TextWrapper
            className="text-text-primary"
            content={
              (data[
                accordionConfiguration.accordionTitleAmountPropertyName ?? ''
              ] as string) ?? accordionConfiguration.accordionTitleAmount
            }
            variant={'Subtitle1'}
          />
        )}
      </div>
      <CustomAccordionSection
        accordionSection={accordionConfiguration.sections[0]}
        handleEditClickSection={handleAccordionEditClick}
        data={data}
      />
      {/* Expandable Sections */}
      <div
        className={cn(
          'flex w-full flex-col gap-4 overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-[1000px] pt-4 opacity-100' : 'max-h-0 opacity-0',
        )}>
        {accordionConfiguration.sections.slice(1).map(section => (
          <CustomAccordionSection
            key={section.accordionSectionId}
            accordionSection={section}
            handleEditClickSection={handleAccordionEditClick}
            data={data}
          />
        ))}
      </div>
      <button
        className="bg-grey-grey-100 absolute right-1/2 bottom-[-13px] flex h-6 w-6 translate-x-1/2 cursor-pointer items-center justify-center rounded-full"
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
