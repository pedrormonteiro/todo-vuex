const state = {
    todos: []
};

const getters = {
    allTodos: (state) => state.todos
};
const getFromStore = () => {
    var response = localStorage.getItem("data");
    console.log(response)
    
    try {
        Array.isArray(JSON.parse(response))
    }
    catch {
        console.log(response);
        localStorage.setItem("data", "[]");
        response = "[]";
    }
    response = JSON.parse(response);

    return response.sort((a, b) => b.id - a.id);
}

const actions = {
    async fetchTodos({ commit }) {

        commit('setTodos', getFromStore());
    },
    async addTodo({ commit }, title) {
        if (title.length >= 1) {
            const currentItemData = getFromStore();
            const currentItem = { title, id: Date.now(), completed: false };
            currentItemData.push(currentItem);
            localStorage.setItem("data", JSON.stringify(currentItemData));

            commit('newTodo', currentItem);
        } else {
            alert("Empty todo")
        }
    },

    async delTodo({ commit }, id) {
        let currentItemData = getFromStore();
        currentItemData = currentItemData.filter((item) => item.id !== id)

        localStorage.setItem("data", JSON.stringify(currentItemData));

        commit('removeTodo', id);
    },

    async filterTodos({ commit }, e) {
        // get selected filter
        const limit = parseInt(e.target.options[e.target.options.selectedIndex].innerText);

        const response = getFromStore().slice(0, limit);

        commit('setTodos', response)
    },

    async updateTodo({ commit }, updTodo) {
        const currentData = getFromStore();
        currentData.forEach((item) => {
            item.id === updTodo.id && (item.completed = updTodo.completed);
        });
        localStorage.setItem("data", JSON.stringify(currentData));

        commit('updateTodo', updTodo);
    }
};

const mutations = {
    setTodos: (state, todos) => (state.todos = todos),
    newTodo: (state, todo) => state.todos.unshift(todo),
    removeTodo: (state, id) => state.todos = state.todos.filter(todo => todo.id !== id),
    updateTodo: (state, updTodo) => {
        const index = state.todos.findIndex(todo => todo.id === updTodo.id);

        if (index !== -1) {
            state.todos.splice(index, 1, updTodo);
        }
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}