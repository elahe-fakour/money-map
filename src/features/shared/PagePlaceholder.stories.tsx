import type { Meta, StoryObj } from '@storybook/react-vite'
import { PagePlaceholder } from './PagePlaceholder'

const meta = {
  component: PagePlaceholder,
  parameters: {
    layout: 'centered',
  },
  title: 'Shared/PagePlaceholder',
} satisfies Meta<typeof PagePlaceholder>

export default meta

type Story = StoryObj<typeof meta>

export const PersianEmptyPage: Story = {
  args: {
    description: 'این صفحه هنوز ساخته نشده و به عنوان حالت موقت نمایش داده می‌شود.',
    eyebrow: 'حالت موقت',
    title: 'صفحه نمونه',
  },
}
