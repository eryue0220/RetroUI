import Image from 'next/image'
import Link from 'next/link'
import type {
  DefaultNodeTypes,
  SerializedUploadNode,
} from '@payloadcms/richtext-lexical'
import {
  type JSXConvertersFunction,
  RichText,
} from '@payloadcms/richtext-lexical/react'
import { Text } from '@/components/retroui'
import { cn } from '@/lib/utils'

const CustomUploadComponent: React.FC<{
  node: SerializedUploadNode
}> = ({ node }) => {
  if (node.relationTo === 'media') {
    const uploadDoc = node.value
    if (typeof uploadDoc !== 'object') {
      return null
    }
    const { alt, height, url, width } = uploadDoc
    return (
      <img
        alt={alt}
        height={height}
        src={`https://cms.retroui.dev${url}`}
        width={width}
        className="mx-auto w-full max-w-[600px] my-8"
      />
    )
  }

  return null
}

type NodeTypes = DefaultNodeTypes
export const JSXConverters: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const Tag = node.tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    const classNames: Record<string, string> = {
      h1: '',
      h2: 'mb-4 mt-8 lg:text-3xl',
      h3: 'mb-4',
      h4: 'mb-2',
      h5: '',
      h6: '',
    }
    return (
      <Text as={Tag} className={classNames[Tag]}>
        {children}
      </Text>
    )
  },
  paragraph: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    return <Text className="text-lg text-foreground">{children}</Text>
  },
  list: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    if (node.listType === 'bullet') {
      return <ul className="list-disc pl-4 lg:pl-8 my-4">{children}</ul>
    }
    return <ol className="list-decimal pl-4 lg:pl-8 my-4">{children}</ol>
  },
  listitem: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    return (
      <Text as="li" className="text-lg text-foreground ml-4 lg:ml-8 mb-2">
        {children}
      </Text>
    )
  },
  link: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const href = node.fields?.url || ''
    const isExternal = href.startsWith('http')
    const linkClass = 'underline underline-offset-4 hover:decoration-primary'

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {children}
        </a>
      )
    }

    return (
      <Link href={href} className={linkClass}>
        {children}
      </Link>
    )
  },
  quote: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    return (
      <blockquote className="border-l-4 border-primary pl-4 my-4 italic">
        {children}
      </blockquote>
    )
  },
  upload: ({ node }) => {
    return <CustomUploadComponent node={node} />
  },
})