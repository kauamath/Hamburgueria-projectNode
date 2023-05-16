const express = require('express')
const uuid = require('uuid')
const port = 3001

const app = express()
app.use(express.json())

const orders = []

const checkId = (request, response, next) => {
    const {id} = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0 ) {
        return response.status(404).json({error: "order not found"})
    }

    request.orderId = id
    request.orderIndex = index

    next()
}

const checkUrl = (request, response, next) => {
    const url = request.url
    const method = request.method

    console.log(url, method)
    next()
}

app.post('/orders', checkUrl, (request, response) => {
    const {order, clientName, price,} = request.body

    const client = {id: uuid.v4(), order, clientName, price, status:"Em preparação"}
    orders.push(client)

    return response.status(201).json(client)
})

app.get('/orders', checkUrl, (request, response) => {
    return response.json(orders)
})

app.put('/orders/:id', checkId, checkUrl, (request, response) => {

    const {order, clientName, price} = request.body
    const id = request.orderId
    const index = request.orderIndex

    const updateOrder = {id, order, clientName, price, status:"Em preparo"}

    orders[index] = updateOrder

    return response.json(updateOrder)
})

app.delete('/orders/:id', checkId, checkUrl,  (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)
    
    return response.status(204).json()
})

app.get('/orders/:id', checkId, checkUrl,  (request, response) => {
    const index = request.orderIndex

    return response.json(orders[index])
    
})

app.patch('/orders/:id', checkId, checkUrl,  (request, response) => {
    const index = request.orderIndex
    const id = request.orderId
    const {order, clientName, price,} = orders[index]

    const client = {id, order, clientName, price, status:"Pronto"}

    return response.status(200).json(client)
})

app.listen(port, () => {
    console.log(`Server started on port ${port} 🚀`)
})