import 'reflect-metadata'
import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { extractNameAndDescription } from '../../src/helpers/extract-name-and-description'

describe('extractNameAndDescription', () => {
  it('should use name from options', () => {
    const schema = z.object({ a: z.string() })
    const result = extractNameAndDescription(schema, { name: 'MyModel' })
    expect(result.name).toBe('MyModel')
  })

  it('should extract name and description from describe()', () => {
    const schema = z.object({ a: z.string() }).describe('UserModel: A user entity')
    const result = extractNameAndDescription(schema, {})
    expect(result.name).toBe('UserModel')
    expect(result.description).toBe('A user entity')
  })

  it('should generate a name when none provided and no description', () => {
    const schema = z.object({ a: z.string() })
    const result = extractNameAndDescription(schema, {})
    expect(result.name).toMatch(/^ClassFromZod_\d+$/)
  })

  it('should prioritize options name over description', () => {
    const schema = z.object({ a: z.string() }).describe('FromDesc: desc')
    const result = extractNameAndDescription(schema, { name: 'Explicit' })
    expect(result.name).toBe('Explicit')
  })
})
