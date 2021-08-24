## Documentation

This is a Small Snake Game that uses some basic concepts of [ECS](https://pt.wikipedia.org/wiki/Entity-component-system) to it's implementation related to this it's good to know the basic concepts of it but you can also dive into the code without knowing about it.

### What is ECS and How it's being used

Basically our System is composed by different Entities, Entities have Components that are responsible for giving the Entity functionalities such as Rendering, Playing or storing some information.

Our game is composed by the `Game` entity that stores some other entities such as the `Food`, `Snake`, `Grid` (composed by `Node` Entities) and the `Interface`. To access their documentation you can click at:

-   [Game](./game/GAME.md)
-   [Grid](./grid/GRID.md)
-   [Node](./node/NODE.md)
-   [Snake](./snake/SNAKE.md)
-   [Food](./food/FOOD.md)
-   [Interface](./game/INTERFACE.md)
