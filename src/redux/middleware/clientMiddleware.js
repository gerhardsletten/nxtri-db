const errorMetaEnhancer = (meta, error = '') => {
  return {
    ...meta,
    analytics: {
      ...meta.analytics,
      payload: {
        ...meta.analytics.payload,
        label: error
      }
    }
  }
}

export default function clientMiddleware (client) {
  return ({dispatch, getState}) => {
    return (next) => (action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState)
      }

      const { promise, types, meta, metaSuccess, metaError, ...rest } = action // eslint-disable-line no-redeclare
      if (!promise) {
        return next(action)
      }

      const [REQUEST, SUCCESS, FAILURE] = types
      next({...rest, type: REQUEST})

      const actionPromise = promise(client)
      actionPromise.then(
        (payload) => next({
          ...rest,
          meta: metaSuccess || meta,
          payload,
          type: SUCCESS
        }),
        (error) => next({
          ...rest,
          error: error.message,
          meta: metaError && errorMetaEnhancer(metaError, error.message),
          type: FAILURE
        })
      ).catch((error) => {
        console.error('MIDDLEWARE ERROR:', error)
        next({
          ...rest,
          error,
          type: FAILURE,
          meta: metaError && errorMetaEnhancer(metaError, error)
        })
      })

      return actionPromise
    }
  }
}
