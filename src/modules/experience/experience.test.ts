import { describe, it, expect, vi, beforeEach } from 'vitest'
import { experienceRoute } from './experience.route.js'


const mocks = vi.hoisted(() => {
    const mockReturning = vi.fn();
    const mockValues = vi.fn();
    const mockInsert = vi.fn();
    const mockWhere = vi.fn();
    const mockFrom = vi.fn();
    const mockSelect = vi.fn();
    const mockDelete = vi.fn();
    const mockUpdate = vi.fn();
    const mockSet = vi.fn();

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
    };
});

vi.mock('../../db/client.js', () => ({
    db: {
        insert: mocks.mockInsert,
        select: mocks.mockSelect,
        delete: mocks.mockDelete,
        update: mocks.mockUpdate,
    },
}))

describe('Experience Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        // Setup default chaining
        mocks.mockInsert.mockReturnValue({ values: mocks.mockValues })
        mocks.mockValues.mockReturnValue({ returning: mocks.mockReturning })

        mocks.mockSelect.mockReturnValue({ from: mocks.mockFrom })
        // Default from returns an object with where.
        mocks.mockFrom.mockReturnValue({ where: mocks.mockWhere })

        mocks.mockDelete.mockReturnValue({ where: mocks.mockWhere })

        mocks.mockUpdate.mockReturnValue({ set: mocks.mockSet })
        mocks.mockSet.mockReturnValue({ where: mocks.mockWhere })
        mocks.mockWhere.mockReturnValue({ returning: mocks.mockReturning })
    })

    describe('POST / ', () => {
        it('should create a new experien', async () => {
            const newExperience = {
                logo: '/placeholder.png',
                position: 'Software Engineer',
                company: 'Tech Co',
                start_date: '2022-01-01',
                end_date: '2022-12-31',
                type: 'Full-time',
                startDate: '2019-07-01',
                endDate: '2020-10-01',
                description: 'Software Engineer',
                skills: ['React.js', 'JavaScript', 'Vue.js'],
                isRemote: true,
            }
            const createdExperience = {
                id: 1,
                ...newExperience,
            }

            mocks.mockReturning.mockResolvedValue([createdExperience])

            const res = await experienceRoute.request('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newExperience),
            })

            expect(res.status).toBe(201)
            const body = await res.json()
            expect(body).toEqual({
                success: true,
                message: 'Experience created successfully',
                data: createdExperience,
            })
            expect(mocks.mockInsert).toHaveBeenCalled()
        })

        it('should create a new experience with Date instances', async () => {
            const newExperience = {
                logo: '/placeholder.png',
                position: 'Software Engineer',
                company: 'Tech Co',
                type: 'Full-time',
                startDate: new Date('2019-07-01'),
                endDate: new Date('2020-10-01'),
                description: 'Software Engineer',
                skills: ['React.js'],
                isRemote: true,
            }
            const createdExperience = {
                id: 1,
                ...newExperience,
                startDate: newExperience.startDate.toISOString(),
                endDate: newExperience.endDate.toISOString(),
            }

            mocks.mockReturning.mockResolvedValue([createdExperience])

            const res = await experienceRoute.request('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newExperience),
            })

            expect(res.status).toBe(201)
            const body = await res.json()
            expect(body.success).toBe(true)
        })
    })

    describe('GET /', () => {
        it('should return all experiences', async () => {
            const experiences = [
                {
                    id: 1,
                    logo: '/placeholder.png',
                    position: 'Software Engineer',
                    company: 'Tech Co',
                    start_date: '2022-01-01',
                    end_date: '2022-12-31',
                    type: 'Full-time',
                    startDate: 'Jul 2019',
                    endDate: 'Oct 2020',
                    description: 'Software Engineer',
                    skills: ['React.js', 'JavaScript', 'Vue.js'],
                    isRemote: true,
                },
                {
                    id: 2,
                    logo: '/placeholder.png',
                    position: 'Software Engineer',
                    company: 'Tech Co',
                    start_date: '2022-01-01',
                    end_date: '2022-12-31',
                    type: 'Full-time',
                    startDate: 'Jul 2019',
                    endDate: 'Oct 2020',
                    description: 'Software Engineer',
                    skills: ['React.js', 'JavaScript', 'Vue.js'],
                    isRemote: true,
                },
            ]

            mocks.mockFrom.mockResolvedValue(experiences)

            const res = await experienceRoute.request('/', {
                method: 'GET',
            })

            expect(res.status).toBe(200)
            const body = await res.json()
            expect(body).toEqual({
                success: true,
                message: 'Experiences fetched successfully',
                data: experiences,
            })
        })
    })

    describe("GET /{id}", () => {
        it('should return a experience and 200 if found', async () => {
            const experience = {
                "id": 1,
                "logo": "/placeholder.png",
                "company": "ZTRUS",
                "position": "UX/UI",
                "type": "intern",
                "startDate": "2029-04-01T00:00:00.000Z",
                "endDate": "2026-07-31T00:00:00.000Z",
                "description": "Provide support for the implementation of E-commerce websites, including wireframing, front-end development, mobile application development, and user interface design with vue.js",
                "skills": [
                    "Adobe XD"
                ],
                "isRemote": false
            }

            mocks.mockWhere.mockResolvedValue([experience])

            const res = await experienceRoute.request('/1', {
                method: 'GET',
            })

            expect(res.status).toBe(200)
            const body = await res.json()
            expect(body).toEqual({
                success: true,
                message: 'Experience fetched successfully',
                data: experience,
            })
        })

        it('should return 404 if not found', async () => {
            mocks.mockWhere.mockResolvedValue([])

            const res = await experienceRoute.request('/999', {
                method: 'GET',
            })

            expect(res.status).toBe(404)
            const body = await res.json()
            expect(body).toEqual({
                success: false,
                message: 'Experience not found',
            })
        })
    })

    describe('PUT /{id}', () => {
        it('should update an experience', async () => {
            const updatedExperience = {
                id: 1,
                logo: '/placeholder.png',
                position: 'Software Engineer',
                company: 'Tech Co',
                start_date: '2022-01-01',
                end_date: '2022-12-31',
                type: 'Full-time',
                startDate: '2019-07-01',
                endDate: '2020-10-01',
                description: 'Software Engineer',
                skills: ['React.js', 'JavaScript', 'Vue.js'],
                isRemote: true,
            }

            mocks.mockReturning.mockResolvedValue([updatedExperience])

            const res = await experienceRoute.request('/1', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedExperience),
            })

            expect(res.status).toBe(200)
            const body = await res.json()
            expect(body).toEqual({
                success: true,
                message: 'Experience updated successfully',
                data: updatedExperience,
            })
        })

        it('should return 404 if not found', async () => {
            const updatedExperience = {
                id: 1,
                logo: '/placeholder.png',
                position: 'Software Engineer',
                company: 'Tech Co',
                start_date: '2022-01-01',
                end_date: '2022-12-31',
                type: 'Full-time',
                startDate: '2019-07-01',
                endDate: '2020-10-01',
                description: 'Software Engineer',
                skills: ['React.js', 'JavaScript', 'Vue.js'],
                isRemote: true,
            }

            mocks.mockReturning.mockResolvedValue([]);
            const res = await experienceRoute.request('/999', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedExperience)
            })

            expect(res.status).toBe(404)
        })
    })

    describe("DELETE /{id}", () => {
        it('should delete a experien and return 200', async () => {
            mocks.mockWhere.mockResolvedValue({ rowCount: 1 })

            const res = await experienceRoute.request('/1', {
                method: 'DELETE',
            })

            expect(res.status).toBe(200)
            const body = await res.json()
            expect(body).toEqual({
                success: true,
                message: 'Experience deleted successfully',
                data: { rowCount: 1 },
            })
        })

        it('should return 0 for deleted if rowCount is missing', async () => {
            mocks.mockWhere.mockResolvedValue({}) // No rowCount

            const res = await experienceRoute.request('/1', {
                method: 'DELETE',
            })

            expect(res.status).toBe(404)
            const body = await res.json()
            expect(body.success).toBe(false)
        })

        it('should return 404 if not found', async () => {
            mocks.mockWhere.mockResolvedValue({ rowCount: 0 })

            const res = await experienceRoute.request('/999', {
                method: 'DELETE',
            })

            expect(res.status).toBe(404)
        })

    })

})