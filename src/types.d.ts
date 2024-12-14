import type { RadioProps } from "@mantine/core"

interface FTNAttributes {
    name: string
    cls: string | number
    dormitory: string
    leaveDate: Date | null
    backDate: Date | null
}

interface FTNAdvanced {
    header: string
    extra: string[]
}

interface RadioCardProps extends RadioProps {
    label: string
    description: string
}