import type { ComponentType } from 'react'
import type { BrandId } from '@/data/types'
import {
  CodePenIcon,
  GithubIcon,
  InstagramIcon,
  type IconProps,
  LinkedinIcon,
  StackOverflowIcon,
  XIcon,
} from './BrandIcons'

export const brandIcons: Record<BrandId, ComponentType<IconProps>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  x: XIcon,
  instagram: InstagramIcon,
  stackoverflow: StackOverflowIcon,
  codepen: CodePenIcon,
}
