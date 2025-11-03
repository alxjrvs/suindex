-- ============================================================================
-- CRAWLER GAME MEMBER VISIBILITY
-- ============================================================================
-- Ensures that users can see crawlers from games they are members of
-- This allows pilots to be assigned to crawlers in their game
--
-- Migration Date: 2025-02-04
-- ============================================================================

-- Drop existing policies if they exist (to ensure clean state)
DROP POLICY IF EXISTS "Game members can view game crawlers" ON crawlers;
DROP POLICY IF EXISTS "Game members can view other members' crawlers" ON crawlers;

-- ============================================================================
-- POLICY: Game members can view crawlers assigned to their games
-- ============================================================================
-- Users can view crawlers that have a game_id if they are members of that game
CREATE POLICY "Game members can view game crawlers"
  ON crawlers FOR SELECT
  TO authenticated
  USING (
    game_id IS NOT NULL 
    AND is_game_member(game_id, auth.uid())
  );

-- ============================================================================
-- POLICY: Game members can view crawlers owned by other game members
-- ============================================================================
-- Users can view crawlers owned by users who are in the same game(s)
-- This allows seeing crawlers from fellow game members even if not assigned to a game yet
CREATE POLICY "Game members can view other members' crawlers"
  ON crawlers FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT DISTINCT gm.user_id
      FROM game_members gm
      WHERE gm.game_id IN (
        SELECT game_id
        FROM game_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- VERIFICATION QUERIES (commented out - run manually to verify)
-- ============================================================================

-- Verify policies are created
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE tablename = 'crawlers'
-- ORDER BY policyname;

-- Test: Check what crawlers a specific user can see
-- SELECT c.id, c.name, c.game_id, c.user_id
-- FROM crawlers c
-- WHERE (
--   -- Own crawlers
--   c.user_id = auth.uid()
--   OR
--   -- Game crawlers
--   (c.game_id IS NOT NULL AND is_game_member(c.game_id, auth.uid()))
--   OR
--   -- Other game members' crawlers
--   c.user_id IN (
--     SELECT DISTINCT gm.user_id
--     FROM game_members gm
--     WHERE gm.game_id IN (
--       SELECT game_id
--       FROM game_members
--       WHERE user_id = auth.uid()
--     )
--   )
-- );

