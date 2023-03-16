import globalHook from 'use-global-hook'

const initial_pool = {
  total_err_count: 0,
  status_err_count: 0
}

const actions = {
  total_err_increment: (store) => {
    const total_err_count = store.state.total_err_count + 1
    store.setState({total_err_count})
  },

  status_err_increment: (store) => {
    const status_err_count = store.state.status_err_count + 1
    store.setState({ status_err_count })
  },

  err_erase: (store, type_to_erase) => {
    switch (type_to_erase) {
      case 'status': {
        const status_err_count = 0
        store.setState({ status_err_count })
        break;
      }
  
      default: {
        const total_err_count = 0
        store.setState({ total_err_count })
        break;
      }
    }
  }
}

const useGlobalErrPool = globalHook(initial_pool, actions)

export default useGlobalErrPool