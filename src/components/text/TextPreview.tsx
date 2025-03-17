import TextWrapper from './TextWrapper';

export default function TextPreview() {
  return (
    <div className="flex flex-col gap-4">
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'H1'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'H2'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'H3'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'H4Medium'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'H4Semibold'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'H4Bold'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'H5'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'H6'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'Subtitle1'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'Subtitle2'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'Subtitle1Bold'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'Subtitle2Bold'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'Body1'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'Body2'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'Body2Medium'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'Caption'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'Overline'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'CaptionSemiBold'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'Label'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'TextFieldLabel'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'ButtonSmall'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'ButtonMedium'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'ButtonLarge'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'ChartLegend'}
      />
      <TextWrapper
        content={'The quick brown fox jumps over the lazy dog'}
        variant={'TableHeader'}
      />
    </div>
  );
}
