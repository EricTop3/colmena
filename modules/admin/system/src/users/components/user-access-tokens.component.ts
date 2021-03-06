import { Component, OnInit } from '@angular/core'
import { UiService } from '@colmena/admin-ui'

import { UsersService } from '../users.service'

@Component({
  selector: 'app-user-access-tokens',
  templateUrl: './user-access-tokens.component.html',
})
export class UserAccessTokensComponent implements OnInit {

  public item: any
  public items: any[]

  constructor(
    public service: UsersService,
    public uiService: UiService,
  ) {
  }

  ngOnInit() {
    this.item = this.service.selectedUser['user']
    this.refreshTokens()
  }

  refreshTokens() {
    this.service.getUserAccessTokens(
      this.item,
      res => this.items = res,
      err => console.error(err)
    )
  }

  handleAction(event) {
    switch (event.type) {
      case 'generateToken':
        return this.service.generateToken(
          this.item,
          () => {
            this.refreshTokens()
            this.uiService.toastSuccess('Generate Token Success', `A new token has been generated for <u>${this.item.username}</u>`)
          },
          err => this.uiService.toastError('Generate Token Fail', err.message)
        )
      case 'deleteToken':
        return this.service.deleteToken(
          {
            user: this.item,
            token: event.payload,
          },
          () => {
            this.refreshTokens()
            this.uiService.toastSuccess('Delete Token Success', `Token <u>${event.payload.id}</u> has been deleted successfully`)
          },
          err => this.uiService.toastError('Delete Token Fail', err.message)
        )
      case 'removeTtl':
        return this.service.removeTtl(
          {
            user: this.item,
            token: event.payload,
          },
          () => {
            this.refreshTokens()
            this.uiService.toastSuccess('Remove TTL Success', `TTL for token <u>${event.payload.id} has been removed successfully`)
          },
          err => this.uiService.toastError('Remove TTL Fail', err.message)
        )
      case 'deleteAllTokens':
        const successCb = () => this.service.deleteAllTokens(
          this.item,
          () => {
            this.refreshTokens()
            this.uiService.toastSuccess('Delete All Tokens Success', `All tokens for <u>${this.item.username}</u> have been deleted successfully`)
          },
          err => this.uiService.toastError('Delete All Tokens Fail', err.message)
        )
        const question = { title: 'Are you sure?', text: 'This action cannot be undone' }
        return this.uiService.alertError(question, successCb, () => ({}))
      default:
        return console.log('Unknown Event Type', event)
    }
  }

}
