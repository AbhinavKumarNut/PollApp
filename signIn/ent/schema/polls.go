package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

// Polls holds the schema definition for the Polls entity.
type Polls struct {
	ent.Schema
}

// Fields of the Polls.
func (Polls) Fields() []ent.Field {
	return []ent.Field{
		field.String("Title"),
		field.JSON("Options", []string{}),
		field.Time("CreatedAt"),
		field.String("CreatedBy"),
	}
}
