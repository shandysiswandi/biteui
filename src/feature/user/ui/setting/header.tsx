export function Header({ title, description }: { title: string; description: string }) {
  return (
    <div className="h-16 pt-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground truncate" title={description}>
        {description}
      </p>
    </div>
  )
}
