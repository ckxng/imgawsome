module.exports = {

    /**
     * generateKey(prefix, length)
     * Get a pseudorandom, somewhat unique key consisting of reletively
     * unambiguous characters.
     * 
     * Params:
     *  prefix   "string" to prefix to returned key
     *  length   integer length of key to generate
     * Returns:
     *  "string" containing prefix and generated key
     */
    generateKey: function(prefix, length) {
        var key = "";
        var pool = "abcdefghijkmnopqrstuvwxyz";
        if(length--) {
            key += pool.charAt(Math.floor(Math.random()*pool.length));
        }
        
        pool = "abcdefghijkmnopqrstuvwxyz023456789";
        while(length--) {
            key += pool.charAt(Math.floor(Math.random() * pool.length));
        }
        return prefix + key;
    }

};