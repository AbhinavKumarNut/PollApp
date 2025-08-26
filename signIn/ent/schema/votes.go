package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

// Votes holds the schema definition for the Votes entity.
type Votes struct {
	ent.Schema
}

// Fields of the Votes.
func (Votes) Fields() []ent.Field {
	return []ent.Field{
		field.Int("PollID").Unique(),
		field.JSON("Votes", map[string][]string{}),
	}
}
