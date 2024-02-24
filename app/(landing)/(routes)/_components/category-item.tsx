"use client"

import qs from "query-string"
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconType } from "react-icons";
import { Button } from "@/components/ui/button";

interface CategoryItemProps {
    label: string;
    value?: string;
    icon?: IconType;
}

export const CategoryItem = ({
    label,
    value,
    icon: Icon,
}: CategoryItemProps) => {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentCategoryId = searchParams.get("categoryId")
    const currentTitle = searchParams.get("title")

    const isSelected = currentCategoryId === value;

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                // title: currentTitle,
                categoryId: isSelected ? null : value,
            }
        }, {skipNull: true, skipEmptyString: true})

        router.push(url)
    }

    return (
      <Button
        onClick={onClick}
        variant="secondary"
        className={cn(
          'py-2 px-3 text-sm bg-muted rounded-md flex items-center gap-x-1 hover:bg-slate-200 transition cursor-pointer',
          isSelected && ' border border-sky-700 bg-sky-200/20 text-sky-800'
        )}
        type="button"
      >
        {/* {Icon && <Icon size={20} />} */}
        <div className="truncate">{label}</div>
      </Button>
    )
}