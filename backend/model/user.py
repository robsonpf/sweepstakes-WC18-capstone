from marshmallow import Schema, fields
from .bet import Bet, BetSchema

class User():
    def __init__(self, firstName, lastName, roles, userName, password, phone, points, active, bets):
        self.firstName = firstName
        self.lastName = lastName
        self.roles = roles
        self.userName = userName
        self.password = password
        self.phone = phone
        self.points = points
        self.active = active
        self.bets = bets

    def __repr__(self):
        return '<User(id={self.userId!r})>'.format(self=self)

class UserSchema(Schema):
    firstName = fields.Str(required=True)
    lastName = fields.Str(required=True)
    roles = fields.List(fields.Str(required=True))
    userName = fields.Str(required=True)
    password = fields.Str(required=True)
    phone = fields.Str(required=True)
    points = fields.Int(required=True)
    active = fields.Bool(required=True)
    bets = fields.List(fields.Nested(BetSchema), required=True)
