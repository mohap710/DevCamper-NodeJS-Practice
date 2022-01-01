export function getBootcamps(request, response, next) {
    response
        .status(200)
        .json({ success: true, msg: `Show all bootcamps` })
}
export function getSingleBootcamps(request, response, next) {
    response
        .status(200)
        .json({ success: true, msg: `Show bootcamps with the id of ${request.params.id}` })
}
export function createNewBootcamps(request, response, next) {
    response
        .status(200)
        .json({ success: true, msg: `Create new bootcamp` })
}
export function updateBootcamps(request, response, next) {
    response
        .status(200)
        .json({ success: true, msg: `updated bootcamp with id of ${request.params.id}` })
}
export function deleteBootcamps(request, response, next) {
    response
        .status(200)
        .json({ success: true, msg: `deleted bootcamp with id of ${request.params.id}` })
}