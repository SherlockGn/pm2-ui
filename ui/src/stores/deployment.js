import { defineStore } from 'pinia'
import { request } from './http.js'

import { ref } from 'vue'

export const useDeploymentStore = defineStore('deployment', () => {
    const deployments = ref([])

    const refresh = async () => {
        let data = (await request.get('deployment'))?.data
        if (!data) {
            return false
        }

        deployments.value = data
        return true
    }

    const create = async deployment => {
        return !!(await request.post('deployment', fromViewObject(deployment)))
    }

    const update = async deployment => {
        return !!(await request.put(
            `deployment/${deployment.id}`,
            fromViewObject(deployment)
        ))
    }

    const deleteItem = async id => {
        return !!(await request.delete(`deployment/${id}`))
    }

    const getDefault = () => {
        return {
            id: 0,
            name: '',
            key: '',
            user: '',
            host: [],
            sshOptions: [],
            ref: '',
            repo: '',
            path: '',
            preSetup: '',
            postSetup: '',
            preDeployLocal: '',
            postDeploy: ''
        }
    }

    const toViewObject = deployment => {
        return {
            id: deployment.id,
            name: deployment.name ?? '',
            key: deployment.key ?? '',
            user: deployment.user ?? '',
            host: deployment.host ?? [],
            sshOptions: deployment.sshOptions ?? [],
            ref: deployment.ref ?? '',
            repo: deployment.repo ?? '',
            path: deployment.path ?? '',
            preSetup: deployment.preSetup ?? '',
            postSetup: deployment.postSetup ?? '',
            preDeployLocal: deployment.preDeployLocal ?? '',
            postDeploy: deployment.postDeploy ?? ''
        }
    }

    const fromViewObject = data => {
        return {
            id: data.id,
            name: data.name,
            key: data.key === '' ? null : data.key,
            user: data.user === '' ? null : data.user,
            host: data.host,
            sshOptions: data.sshOptions,
            ref: data.ref === '' ? null : data.ref,
            repo: data.repo === '' ? null : data.repo,
            path: data.path === '' ? null : data.path,
            preSetup: data.preSetup === '' ? null : data.preSetup,
            postSetup: data.postSetup === '' ? null : data.postSetup,
            preDeployLocal:
                data.preDeployLocal === '' ? null : data.preDeployLocal,
            postDeploy: data.postDeploy === '' ? null : data.postDeploy
        }
    }
    const getJson = deployment => {
        const jsonObject = {
            key: deployment.key,
            user: deployment.user,
            host: deployment.host,
            ssh_options: deployment.sshOptions.length
                ? deployment.sshOptions
                : null,
            ref: deployment.ref,
            repo: deployment.repo,
            path: deployment.path,
            'pre-setup': deployment.preSetup,
            'post-setup': deployment.postSetup,
            'pre-deploy-local': deployment.preDeployLocal,
            'post-deploy': deployment.postDeploy
        }
        for (const key in jsonObject) {
            if (jsonObject[key] == null) {
                delete jsonObject[key]
            }
        }
        return JSON.stringify({
            [deployment.name]: jsonObject
        })
    }

    const setup = async id => {
        return (await request.post(`/deployment/${id}/setup`))?.data
    }

    const deploy = async id => {
        return (await request.post(`/deployment/${id}/deploy`))?.data
    }

    const updateAction = async id => {
        return (await request.post(`/deployment/${id}/update`))?.data
    }

    const revert = async (id, num) => {
        return (await request.post(`/deployment/${id}/revert`, { num }))?.data
    }

    const curr = async id => {
        return (await request.post(`/deployment/${id}/curr`))?.data
    }

    const prev = async id => {
        return (await request.post(`/deployment/${id}/prev`))?.data
    }

    const exec = async (id, cmd) => {
        return (await request.post(`/deployment/${id}/exec`, { cmd }))?.data
    }

    const list = async id => {
        return (await request.post(`/deployment/${id}/list`))?.data
    }

    return {
        deployments,
        refresh,
        create,
        update,
        deleteItem,
        getJson,
        getDefault,
        fromViewObject,
        toViewObject,
        setup,
        deploy,
        updateAction,
        revert,
        curr,
        prev,
        exec,
        list
    }
})
