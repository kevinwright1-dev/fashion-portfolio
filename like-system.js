// like-system.js
// Reusable like system for outfits and clothing items

class LikeSystem {
    constructor(supabaseClient, currentUser) {
        this.supabase = supabaseClient;
        this.currentUser = currentUser;
    }

    /**
     * Check if user has liked an item
     * @param {string} itemType - 'outfit' or 'clothing_item'
     * @param {string} itemId - UUID of the item
     * @returns {Promise<boolean>}
     */
    async hasLiked(itemType, itemId) {
        if (!this.currentUser) return false;

        try {
            const { data, error } = await this.supabase
                .from('likes')
                .select('id')
                .eq('user_id', this.currentUser.id)
                .eq('likeable_type', itemType)
                .eq('likeable_id', itemId)
                .single();

            return data !== null;
        } catch (error) {
            // No like found
            return false;
        }
    }

    /**
     * Like an item
     * @param {string} itemType - 'outfit' or 'clothing_item'
     * @param {string} itemId - UUID of the item
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async like(itemType, itemId) {
        if (!this.currentUser) {
            return { success: false, error: 'Must be logged in to like' };
        }

        try {
            // Insert like
            const { error } = await this.supabase
                .from('likes')
                .insert([{
                    user_id: this.currentUser.id,
                    likeable_type: itemType,
                    likeable_id: itemId
                }]);

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Error liking item:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Unlike an item
     * @param {string} itemType - 'outfit' or 'clothing_item'
     * @param {string} itemId - UUID of the item
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async unlike(itemType, itemId) {
        if (!this.currentUser) {
            return { success: false, error: 'Must be logged in to unlike' };
        }

        try {
            const { error } = await this.supabase
                .from('likes')
                .delete()
                .eq('user_id', this.currentUser.id)
                .eq('likeable_type', itemType)
                .eq('likeable_id', itemId);

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Error unliking item:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Toggle like status
     * @param {string} itemType - 'outfit' or 'clothing_item'
     * @param {string} itemId - UUID of the item
     * @returns {Promise<{liked: boolean, success: boolean, error?: string}>}
     */
    async toggleLike(itemType, itemId) {
        const isLiked = await this.hasLiked(itemType, itemId);

        if (isLiked) {
            const result = await this.unlike(itemType, itemId);
            return { ...result, liked: false };
        } else {
            const result = await this.like(itemType, itemId);
            return { ...result, liked: true };
        }
    }

    /**
     * Get like count for an item
     * @param {string} itemType - 'outfit' or 'clothing_item'
     * @param {string} itemId - UUID of the item
     * @returns {Promise<number>}
     */
    async getLikeCount(itemType, itemId) {
        try {
            const { count, error } = await this.supabase
                .from('likes')
                .select('*', { count: 'exact', head: true })
                .eq('likeable_type', itemType)
                .eq('likeable_id', itemId);

            if (error) throw error;

            return count || 0;
        } catch (error) {
            console.error('Error getting like count:', error);
            return 0;
        }
    }

    /**
     * Get users who liked an item
     * @param {string} itemType - 'outfit' or 'clothing_item'
     * @param {string} itemId - UUID of the item
     * @returns {Promise<Array>}
     */
    async getLikers(itemType, itemId) {
        try {
            const { data, error } = await this.supabase
                .from('likes')
                .select(`
                    created_at,
                    profiles (id, username, avatar_url)
                `)
                .eq('likeable_type', itemType)
                .eq('likeable_id', itemId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error getting likers:', error);
            return [];
        }
    }
}

// Export for use in HTML files
if (typeof window !== 'undefined') {
    window.LikeSystem = LikeSystem;
}