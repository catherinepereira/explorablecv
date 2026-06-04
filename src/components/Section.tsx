// Section + four standard content primitives:
//   - <Section id number title blurb> wraps one numbered section
//   - <Card>, <Label>, <Prose>, <Term> are the panel pieces

import type { ReactNode } from 'react'

type Props = {
  id: string
  number: string
  title: string
  blurb?: string
  children: ReactNode
}

export function Section({ id, number, title, blurb, children }: Props) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-baseline gap-3 mb-2 flex-wrap">
        <span className="text-xs font-mono text-gray-400 dark:text-zinc-500">{number}</span>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-zinc-100">{title}</h2>
      </div>
      {blurb && (
        <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 max-w-7xl leading-relaxed">
          {blurb}
        </p>
      )}
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`p-4 bg-gray-50/40 dark:bg-zinc-800/40 rounded-lg border border-gray-200 dark:border-zinc-800 ${className}`}
    >
      {children}
    </div>
  )
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-500 mb-2">
      {children}
    </div>
  )
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed space-y-3 max-w-7xl">
      {children}
    </div>
  )
}

export function Term({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[0.85em] text-blue-600 dark:text-blue-400">{children}</span>
  )
}
