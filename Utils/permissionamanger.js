export default class PermissionManager {
  constructor (databaseConnection) {
    this.connection = databaseConnection
    this.permissionEnum = this.generateEnum(this.getPermissionMap())
  }

  getUserPermissionLevel (uid) {
    return this.connection.getUserPermissionLevel(uid)
  }

  setUserPermissionLevel (uid, newLevel) {
    this.connection.setUserPermissionLevel(uid, newLevel)
  }

  getAvailablePermissions () {
    return Object.keys(this.permissionEnum)
  }

  getUserPermissions (uid) {
    const userPerms = []
    for (const name of Object.keys(this.permissionEnum)) {
      if (this.userHasPermission(uid, name)) userPerms.push(name)
    }
    return userPerms
  }

  getPermissionMap () {
    return this.connection.getPermissionMap()
  }

  generateEnum (permissionMap) {
    const obj = {}
    permissionMap.forEach(e => (obj[e.name] = e.flag))
    return obj
  }

  userHasPermission (uid, perm) {
    const user = this.getUserPermissionLevel(uid)
    if ((user & this.permissionEnum[perm]) === this.permissionEnum[perm]) return true
    else if (this.isUserAdmin(uid)) return true
    else return false
  }

  isUserAdmin (uid) {
    const user = this.getUserPermissionLevel(uid)
    if ((user & this.permissionEnum.ADMINISTRATOR) === this.permissionEnum.ADMINISTRATOR) return true
    else return false
  }

  userRemovePermission (uid, perm) {
    const newPerm = this.getUserPermissionLevel(uid) & ~this.permissionEnum[perm]
    this.setUserPermissionLevel(uid, newPerm)
  }

  userAddPermission (uid, perm) {
    const newPerm = this.getUserPermissionLevel(uid) | this.permissionEnum[perm]
    this.setUserPermissionLevel(uid, newPerm)
  }

  toggleUserPermission (uid, perm) {
    this.userHasPermission(uid, perm) ? this.userRemovePermission(uid, perm) : this.userAddPermission(uid, perm)
  }
}
