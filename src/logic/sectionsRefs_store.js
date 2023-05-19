import globalHook from 'use-global-hook'

const initial_store = {
  section_pool: [],
  intersection_pool: {},
  intersectionCheck_ref: {current: undefined}
}

const actions = {
  add_section_to_pool: (store, section_ref) => {
    const arr_to_upd = store.state.section_pool.push(section_ref)
    store.setState(prevState => ({
      ...prevState,
      section_pool: prevState.section_pool.concat(section_ref)
    }))
  },

  set_intersectionCheck_ref: (store, div_ref) => {
    const intersectionCheck_ref = div_ref
    store.setState({intersectionCheck_ref})
  },

  clean_section: (store, section_id) => {
    let section_pool = store.state.section_pool.filter((ref) => {
      if (ref.current) {
        let ref_id = ref.current.id
        return ref_id != section_id
      }
    })

    store.setState({section_pool})
  },

  clean_pool: (store) => {
    const section_pool = []
    store.setState({section_pool})
  },

  refresh_intersection_pool: (store, pool_arr) => {
    const intersection_pool = pool_arr
    store.setState({intersection_pool})
  }
}

const useSectionStore = globalHook(initial_store, actions)

export default useSectionStore