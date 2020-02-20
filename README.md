# web-examples

Example implementation of the AMY UI by using amy.app API

## Get user token

So a user can interact with Amy the user needs a user Token. You can generate a user token via our API at https://learn.amy.app/__/api/ . Under point `Auth` you will find `generate-user-token`.
You will need three parameters: `oauth_consumer_key`, `api_key` and `user_id`.

The return value will be a JSON looking like this

```
{
    token: "long token string",
    amy_user_id: "Jaipuna_juhu_user1",
}
```

## Start webserver

To start the example project all you need to do is run a local webserver. eg. `npx serve`. This should server your local project on port `5000`. No you can open the example page via http://localhost:5000
