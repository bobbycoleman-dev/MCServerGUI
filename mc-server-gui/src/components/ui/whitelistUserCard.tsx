import { Card, CardContent } from "@/components/ui/card";

type WhitelistUserCardProps = {
  uuid: string;
  name: string;
  size: "sm" | "md" | "lg";
}

export default function WhitelistUserCard({ uuid, name, size }: WhitelistUserCardProps) {
  const sizeVarients = {
    sm: "h-[150px] w-[150px]",
    md: "h-[250px] w-[250px]",
    lg: "h-[300px] w-[300px]",
  }

  return (
    <Card className={`${sizeVarients[size]} flex-shrink-0`}>
      <CardContent className="flex flex-col gap-2 items-center pt-4">
        <img src={`https://mc-heads.net/head/${uuid}/160`} alt={name} className="" />
        <p className={`${size == "sm" ? 'text-sm' : 'text-xl'} text-gray-300`}>{name}</p>
      </CardContent>
    </Card >
  )
}

