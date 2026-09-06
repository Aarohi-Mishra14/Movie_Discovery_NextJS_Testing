import { render } from '@testing-library/react'
import SkeletonGrid from '../SkeletonGrid'

describe('SkeletonGrid', () => {
  it('renders without crashing', () => {
    const { container } = render(<SkeletonGrid />)
    expect(container.querySelector('.skeleton-grid')).toBeInTheDocument()
  })

  it('renders the default number of skeleton cards', () => {
    const { container } = render(<SkeletonGrid />)
    expect(container.querySelectorAll('.skeleton-card')).toHaveLength(10)
  })

  it('renders the number of skeleton cards passed through the count prop', () => {
    const { container } = render(<SkeletonGrid count={4} />)
    expect(container.querySelectorAll('.skeleton-card')).toHaveLength(4)
  })

  it('is hidden from assistive technology', () => {
    const { container } = render(<SkeletonGrid count={2} />)
    expect(container.querySelector('.skeleton-grid')).toHaveAttribute('aria-hidden', 'true')
  })
})
