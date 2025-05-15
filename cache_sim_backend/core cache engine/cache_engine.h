#ifndef CACHE_ENGINE_H
#define CACHE_ENGINE_H

#include <vector>
#include <list>
#include <iostream>
#include <iomanip>
#include <fstream>
#include <sstream>

using namespace std;

class CacheEngine {
private:
    int rows, cols;
    int size;
    int maxProbeLimit;
    double loadFactorThreshold;
    int hitCount, missCount, collisionCount;
    int probeHits, chainHits, probeMisses, chainMisses;

    vector<vector<list<int>>> table;

    pair<int, int> primaryHash(int key);
    pair<int, int> quadraticProbe(int i, int j, int probeCount);
    pair<int, int> doubleHash(int key, int attempt);
    double getLoadFactor() const;
    void rehash();

public:
    CacheEngine(int r = 4, int c = 4, int maxProbe = 5, double threshold = 0.7);
    bool search(int key);
    void insert(int key, bool countStats = true);
    void simulateRequestStream(const vector<int>& keys);
    void printStatsAsJSON() const;
};

#endif