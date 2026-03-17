import { defineStore } from 'pinia'
import { request } from './http.js'

export const useMetricStore = defineStore('metric', () => {
    const getMetric = async (
        pmId,
        metricName,
        start,
        end,
        aggregate,
        sample
    ) => {
        let data = (
            await request.get(`metric/${pmId}`, {
                params: {
                    metricName,
                    start,
                    end,
                    aggregate,
                    sample
                }
            })
        )?.data
        if (!data) {
            return []
        }
        return data
    }

    return {
        getMetric
    }
})
