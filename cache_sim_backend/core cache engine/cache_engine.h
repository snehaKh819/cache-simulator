#ifndef CACHE_ENGINE_H
#define CACHE_ENGINE_H

#include <iostream>
#include <vector>
#include <list>
#include <utility>
#include <iomanip>
#include <fstream>
#include <cstdlib>
#include <cmath>

using namespace std;

class CacheEngine {
public:
    CacheEngine(int r = 8, int c = 8, int maxProbe = 5, double threshold = 0.75);

    // Main operations
    bool search(int key) const;
    void insert(int key, bool countStats = true);
    void simulateRequestStream(const vector<int>& keys);
    void printStatsAsJSON() const;

private:
    int rows, cols, size;
    int maxProbeLimit;
    double loadFactorThreshold;

    // Statistics
    int hitCount, missCount, collisionCount;
    int probeHits, chainHits, probeMisses, chainMisses;

    vector<vector<list<int>>> table;

    // Hashing and probing
    pair<int, int> primaryHash(int key) const;
    pair<int, int> quadraticProbe(int i, int j, int probeCount) const;
    pair<int, int> doubleHash(int key, int attempt) const;

    double getLoadFactor() const;
    void rehash();

    // Combined search and insert logic to avoid redundant lookups
    bool findAndMaybeInsert(int key, bool doInsert, bool countStats);
};

#endif