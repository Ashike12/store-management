import {IconPlus} from '@tabler/icons-react';
import {CustomButton} from './CustomButton';

export default function CustomButtonPreview() {
  return (
    <div className="grid max-w-[600px] grid-cols-3 gap-x-[60px] gap-y-[20px] rounded">
      <CustomButton
        text={'Button'}
        iconAlign="left"
        Icon={IconPlus}
        variant={'primary'}
      />
      <CustomButton text={'Button'} Icon={IconPlus} variant={'primary'} />
      <CustomButton text={'Button'} disabled variant={'primary'} />
      <CustomButton
        text={'Button'}
        iconAlign="left"
        Icon={IconPlus}
        variant={'secondary'}
      />
      <CustomButton text={'Button'} Icon={IconPlus} variant={'secondary'} />
      <CustomButton text={'Button'} disabled variant={'secondary'} />
      <CustomButton
        text={'Button'}
        iconAlign="left"
        Icon={IconPlus}
        variant={'outline'}
      />
      <CustomButton text={'Button'} Icon={IconPlus} variant={'outline'} />
      <CustomButton text={'Button'} disabled variant={'outline'} />
      <CustomButton
        text={'Button'}
        iconAlign="left"
        Icon={IconPlus}
        variant={'ghost'}
      />
      <CustomButton text={'Button'} Icon={IconPlus} variant={'ghost'} />
      <CustomButton text={'Button'} disabled variant={'ghost'} />
      <CustomButton text={'Button'} loading variant={'primary'} />
      <CustomButton text={'Button'} variant={'secondary'} loading />
      <CustomButton text={'Button'} loading variant={'outline'} />
      <CustomButton text={'Button'} size={'lg'} variant={'primary'} />
      <CustomButton text={'Button'} size={'md'} variant={'primary'} />
      <CustomButton text={'Button'} size={'sm'} variant={'primary'} />
    </div>
  );
}
