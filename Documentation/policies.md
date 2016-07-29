# Policies.js

This file bind a "policy", that is basically a middleware which runs between a request and a response, to an action of a specific controller.

There are three pre-defined policies:
* **`loadLoggedUser`**: adds to the `req` object the infos of the logged user who made the request, it could be `undefined` if no user is logged at the launching of the request.
* **`isAuthenticated`**: checks if the request was made by an authenticated user: if is that the case, then the request can continue (`next()` callback is called), otherwise the request is interrupted and a status of 401 is returned as a response.
* **`recordLoader`**: checks if the request contains ad `id` parameter, if yes then probably the request was made to access a specific record, so this middleware apply the permission function for that couple action-resource and if it pass that check the preloads it adding it to the req object. At this point the actual controller for the findOne/show action just returns it from that req object.

Basically you always need `loadLoggedUser` and `recordLoader`, and if you want authentication checking, add `isAuthenticated` between the two of them, like this `['loadLoggedUser','isAuthenticated','recordLoader']`.

[Sails doc for policies]("http://sailsjs.org/documentation/concepts/policies")
