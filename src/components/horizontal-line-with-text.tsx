export interface HorizontalLineWithTextProps {
  text: string
  className?: string

}
export const HorizontalLineWithText = ({ text, className }: HorizontalLineWithTextProps) => {

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          {text}
        </span>
      </div>
    </div>
  )
}

export default HorizontalLineWithText