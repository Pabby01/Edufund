/*
# EduFund — Allow Pledge and Goal Lifecycle Operations

1. Grant DELETE on pledges table to authenticated and anon roles
2. Add RLS policy for goal owners to delete pledges attached to their goals
3. Add RLS policy for sponsors to delete unacknowledged pledges (note_moderation = 'pending' or status in ('cancelled', 'paused'))
*/

-- Grant DELETE on pledges to authenticated and anon
GRANT DELETE ON pledges TO authenticated, anon;

-- Policy allowing goal owners (students/receivers) to delete pledges attached to their goals
DROP POLICY IF EXISTS "pledges_delete_owner" ON pledges;
CREATE POLICY "pledges_delete_owner"
ON pledges FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM education_goals g WHERE g.id = pledges.goal_id AND g.user_id = auth.uid()));

-- Policy allowing sponsors to delete their unacknowledged or cancelled pledges
DROP POLICY IF EXISTS "pledges_delete_sponsor_unacknowledged" ON pledges;
CREATE POLICY "pledges_delete_sponsor_unacknowledged"
ON pledges FOR DELETE TO anon, authenticated
USING (
  note_moderation = 'pending'
  OR status = 'cancelled'
);

