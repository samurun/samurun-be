import { describe, it, expect, vi, beforeEach } from 'vitest'
import { summaryRoute } from './summary.route.js'

const mocks = vi.hoisted(() => {
    const mockReturning = vi.fn()
    const mockValues = vi.fn()
    const mockInsert = vi.fn()
    const mockWhere = vi.fn()
    const mockFrom = vi.fn()
    const mockSelect = vi.fn()
    const mockDelete = vi.fn()
    const mockUpdate = vi.fn()
    const mockSet = vi.fn()

    return {
        mockInsert,
        mockValues,
        mockReturning,
        mockSelect,
        mockFrom,
        mockWhere,
        mockDelete,
        mockUpdate,
        mockSet,
    }
})

vi.mock('../../db/client.js', () => ({
    db: {
        insert: mocks.mockInsert,
        select: mocks.mockSelect,
        delete: mocks.mockDelete,
        update: mocks.mockUpdate,
    },
}))

describe('Summary Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        // Setup default chaining
        mocks.mockInsert.mockReturnValue({ values: mocks.mockValues })
        mocks.mockValues.mockReturnValue({ returning: mocks.mockReturning })

        mocks.mockSelect.mockReturnValue({ from: mocks.mockFrom })
        // Default from returns an object with where.
        // Use 'as any' to avoid strict type checks if we override it later.
        mocks.mockFrom.mockReturnValue({ where: mocks.mockWhere })

        mocks.mockDelete.mockReturnValue({ where: mocks.mockWhere })

        mocks.mockUpdate.mockReturnValue({ set: mocks.mockSet })
        mocks.mockSet.mockReturnValue({ where: mocks.mockWhere })
        mocks.mockWhere.mockReturnValue({ returning: mocks.mockReturning })
    })

    describe('POST /', () => {
        it('should create a new summary', async () => {
            const newSummary = { title: 'Summary 1', description: 'Description 1' }
            const createdSummary = { id: 1, ...newSummary }

            mocks.mockReturning.mockResolvedValue([createdSummary])

            const res = await summaryRoute.request('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSummary),
            })

            expect(res.status).toBe(201)
            const body = await res.json()

            expect(body).toEqual({
                success: true,
                message: 'Summary created successfully',
                data: createdSummary,
            })
            expect(mocks.mockInsert).toHaveBeenCalled()
        })
    })

    describe('GET /', () => {
        it('should get all summaries', async () => {
            const summaries = [
                { id: 1, title: 'Summary 1', description: 'Description 1' },
                { id: 2, title: 'Summary 2', description: 'Description 2' },
            ]

            mocks.mockFrom.mockResolvedValue(summaries)

            const res = await summaryRoute.request('/', {
                method: 'GET',
            })


            expect(res.status).toBe(200)
            const body = await res.json()

            expect(body).toEqual({
                success: true,
                message: 'Summaries fetched successfully',
                data: summaries,
            })
            expect(mocks.mockSelect).toHaveBeenCalled()
        })
    })

    describe('PUT /{id}', () => {
        it('should update a summary', async () => {
            const updatedSummary = { title: 'Summary 1', description: 'Description 1' }
            const createdSummary = { id: 1, ...updatedSummary }

            mocks.mockFrom.mockResolvedValue([createdSummary])

            const res = await summaryRoute.request('/1', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedSummary),
            })

            expect(res.status).toBe(200)
            const body = await res.json()

            expect(body).toEqual({
                success: true,
                message: 'Summary updated successfully',
                data: createdSummary,
            })
            expect(mocks.mockUpdate).toHaveBeenCalled()
        })

        it('should return null if summary to update is not found', async () => {
            const updatedSummary = { title: 'Summary 1', description: 'Description 1' }
            mocks.mockReturning.mockResolvedValue([])

            const res = await summaryRoute.request('/999', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedSummary),
            })

            expect(res.status).toBe(200)
            const body = await res.json()
            expect(body.data).toBeNull()
        })
    })
})