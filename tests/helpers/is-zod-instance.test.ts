import 'reflect-metadata'
import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { isZodInstance } from '../../src/helpers/is-zod-instance'

describe('isZodInstance', () => {
  it('should identify ZodString', () => {
    expect(isZodInstance(z.ZodString, z.string())).toBe(true)
  })

  it('should identify ZodNumber', () => {
    expect(isZodInstance(z.ZodNumber, z.number())).toBe(true)
  })

  it('should identify ZodBoolean', () => {
    expect(isZodInstance(z.ZodBoolean, z.boolean())).toBe(true)
  })

  it('should identify ZodObject', () => {
    expect(isZodInstance(z.ZodObject, z.object({ a: z.string() }))).toBe(true)
  })

  it('should identify ZodArray', () => {
    expect(isZodInstance(z.ZodArray, z.array(z.string()))).toBe(true)
  })

  it('should identify ZodOptional', () => {
    expect(isZodInstance(z.ZodOptional, z.string().optional())).toBe(true)
  })

  it('should identify ZodNullable', () => {
    expect(isZodInstance(z.ZodNullable, z.string().nullable())).toBe(true)
  })

  it('should identify ZodDefault', () => {
    expect(isZodInstance(z.ZodDefault, z.string().default('hello'))).toBe(true)
  })

  it('should identify ZodEnum', () => {
    expect(isZodInstance(z.ZodEnum, z.enum(['a', 'b']))).toBe(true)
  })

  it('should identify ZodEnum from nativeEnum', () => {
    enum Color { Red = 'red', Blue = 'blue' }
    expect(isZodInstance(z.ZodEnum, z.nativeEnum(Color))).toBe(true)
  })

  it('should return false for mismatched types', () => {
    expect(isZodInstance(z.ZodString, z.number())).toBe(false)
    expect(isZodInstance(z.ZodNumber, z.string())).toBe(false)
    expect(isZodInstance(z.ZodObject, z.string())).toBe(false)
  })
})
