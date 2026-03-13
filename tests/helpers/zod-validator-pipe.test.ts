import 'reflect-metadata'
import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { BadRequestException } from '@nestjs/common'
import { ZodValidatorPipe } from '../../src/helpers/zod-validator.pipe'

describe('ZodValidatorPipe', () => {
  const metadata = { type: 'body' as const }

  it('should pass valid data through', async () => {
    const pipe = new ZodValidatorPipe(z.string())
    const result = await pipe.transform('hello', metadata)
    expect(result).toBe('hello')
  })

  it('should pass valid object data through', async () => {
    const schema = z.object({ name: z.string(), age: z.number() })
    const pipe = new ZodValidatorPipe(schema)
    const input = { name: 'Alice', age: 30 }
    const result = await pipe.transform(input, metadata)
    expect(result).toEqual(input)
  })

  it('should throw BadRequestException on invalid data', async () => {
    const pipe = new ZodValidatorPipe(z.string())
    await expect(pipe.transform(123, metadata)).rejects.toThrow(BadRequestException)
  })

  it('should throw BadRequestException with issues for object', async () => {
    const schema = z.object({ name: z.string() })
    const pipe = new ZodValidatorPipe(schema)

    try {
      await pipe.transform({ name: 123 }, metadata)
      expect.fail('Should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException)
    }
  })

  it('should handle nested path errors', async () => {
    const schema = z.object({
      address: z.object({
        city: z.string(),
      }),
    })
    const pipe = new ZodValidatorPipe(schema)

    try {
      await pipe.transform({ address: { city: 42 } }, metadata)
      expect.fail('Should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException)
    }
  })
})
