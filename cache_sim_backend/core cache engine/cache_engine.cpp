#include "cache_engine.h"

CacheEngine::CacheEngine(int r, int c, int maxProbe, double threshold)
    : rows(r), cols(c), size(0), maxProbeLimit(maxProbe), loadFactorThreshold(threshold),
      hitCount(0), missCount(0), collisionCount(0),
      probeHits(0), chainHits(0), probeMisses(0), chainMisses(0) {
    table.resize(rows, vector<list<int>>(cols));
}

pair<int, int> CacheEngine::primaryHash(int key) const {
    key = ((key >> 16) ^ key) * 0x45d9f3b;
    key = ((key >> 16) ^ key) * 0x45d9f3b;
    key = (key >> 16) ^ key;
    int i = key % rows;
    int j = (key / rows) % cols;
    return {abs(i), abs(j)};
}

pair<int, int> CacheEngine::quadraticProbe(int i, int j, int probeCount) const {
    int offset = probeCount * probeCount;
    int newI = (i + offset) % rows;
    int newJ = (j + offset) % cols;
    return {newI, newJ};
}

pair<int, int> CacheEngine::doubleHash(int key, int attempt) const {
    int h1 = key % rows;
    int h2 = 1 + (key % (cols - 1));
    int newI = (h1 + attempt * h2) % rows;
    int newJ = (key / rows + attempt * h2) % cols;
    return {abs(newI), abs(newJ)};
}

double CacheEngine::getLoadFactor() const {
    return static_cast<double>(size) / (rows * cols);
}

void CacheEngine::rehash() {
    vector<int> allKeys;
    for (const auto& row : table) {
        for (const auto& cell : row) {
            for (int key : cell) {
                allKeys.push_back(key);
            }
        }
    }

    rows *= 2;
    cols *= 2;
    size = 0;

    table.clear();
    table.resize(rows, vector<list<int>>(cols));

    for (int key : allKeys) {
        insert(key, false); 
    }

    // Ensure load factor is below threshold after rehashing
    while (getLoadFactor() > loadFactorThreshold) {
        rows *= 2;
        cols *= 2;
        table.clear();
        table.resize(rows, vector<list<int>>(cols));
        size = 0;
        for (int key : allKeys) {
            insert(key, false);
        }
    }
}

// Combined search and insert logic to avoid redundant lookups
bool CacheEngine::findAndMaybeInsert(int key, bool doInsert, bool countStats) {
    pair<int, int> pos = primaryHash(key);
    int i = pos.first, j = pos.second;

    // Check primary cell (chaining)
    for (int val : table[i][j]) {
        if (val == key) {
            if (countStats) { hitCount++; chainHits++; }
            return true;
        }
    }
    if (countStats) chainMisses++;

    // Quadratic probing
    for (int probe = 1; probe <= maxProbeLimit; ++probe) {
        pair<int, int> newPos = quadraticProbe(i, j, probe);
        int newI = newPos.first, newJ = newPos.second;

        for (int val : table[newI][newJ]) {
            if (val == key) {
                if (countStats) { hitCount++; probeHits++; }
                return true;
            }
        }
    }
    if (countStats) probeMisses++;

    // Double hashing (try up to maxProbeLimit attempts)
    for (int attempt = 1; attempt <= maxProbeLimit; ++attempt) {
        pair<int, int> doubleHashPos = doubleHash(key, attempt);
        int di = doubleHashPos.first, dj = doubleHashPos.second;
        for (int val : table[di][dj]) {
            if (val == key) {
                if (countStats) { hitCount++; probeHits++; }
                return true;
            }
        }
    }

    // Not found, insert if requested
    if (doInsert) {
        if (countStats) missCount++;
        // Try to insert in primary cell
        if (table[i][j].empty()) {
            table[i][j].push_back(key);
        } else {
            bool inserted = false;
            // Try quadratic probing
            for (int probe = 1; probe <= maxProbeLimit; ++probe) {
                pair<int, int> newPos = quadraticProbe(i, j, probe);
                int newI = newPos.first, newJ = newPos.second;
                if (table[newI][newJ].empty()) {
                    table[newI][newJ].push_back(key);
                    if (countStats) collisionCount++;
                    inserted = true;
                    break;
                } else {
                    if (countStats) collisionCount++;
                }
            }
            // Try double hashing if not inserted
            if (!inserted) {
                for (int attempt = 1; attempt <= maxProbeLimit; ++attempt) {
                    pair<int, int> doubleHashPos = doubleHash(key, attempt);
                    int di = doubleHashPos.first, dj = doubleHashPos.second;
                    if (table[di][dj].empty()) {
                        table[di][dj].push_back(key);
                        if (countStats) collisionCount++;
                        inserted = true;
                        break;
                    } else {
                        if (countStats) collisionCount++;
                    }
                }
            }
            // If still not inserted, append to primary cell (chaining fallback)
            if (!inserted) {
                table[i][j].push_back(key);
                if (countStats) collisionCount++;
            }
        }
        size++;
        // Rehash if needed
        if (getLoadFactor() > loadFactorThreshold) {
            rehash();
        }
    }
    return false;
}

bool CacheEngine::search(int key) const {
    pair<int, int> pos = primaryHash(key);
    int i = pos.first, j = pos.second;

    for (int val : table[i][j]) {
        if (val == key) return true;
    }
    for (int probe = 1; probe <= maxProbeLimit; ++probe) {
        pair<int, int> newPos = quadraticProbe(i, j, probe);
        int newI = newPos.first, newJ = newPos.second;
        for (int val : table[newI][newJ]) {
            if (val == key) return true;
        }
    }
    for (int attempt = 1; attempt <= maxProbeLimit; ++attempt) {
        pair<int, int> doubleHashPos = doubleHash(key, attempt);
        int di = doubleHashPos.first, dj = doubleHashPos.second;
        for (int val : table[di][dj]) {
            if (val == key) return true;
        }
    }
    return false;
}

void CacheEngine::insert(int key, bool countStats) {
    findAndMaybeInsert(key, true, countStats);
}

void CacheEngine::simulateRequestStream(const vector<int>& keys) {
    for (int key : keys) {
        insert(key, true);
    }
}

void CacheEngine::printStatsAsJSON() const {
    double loadFactor = getLoadFactor();
    cout << fixed << setprecision(2);
    cout << "{\n";
    cout << "  \"hits\": " << hitCount << ",\n";
    cout << "  \"misses\": " << missCount << ",\n";
    cout << "  \"collisions\": " << collisionCount << ",\n";
    cout << "  \"load_factor\": " << loadFactor << ",\n";
    cout << "  \"probe_hits\": " << probeHits << ",\n";
    cout << "  \"chain_hits\": " << chainHits << ",\n";
    cout << "  \"probe_misses\": " << probeMisses << ",\n";
    cout << "  \"chain_misses\": " << chainMisses << "\n";
    cout << "}" << endl;
}

int main(int argc, char* argv[]) {
    CacheEngine cache;
    vector<int> inputKeys;

    if (argc == 2) {
        std::ifstream file(argv[1]);
        if (!file.is_open()) {
            cerr << "Error: Unable to open file '" << argv[1] << "'." << endl;
            return 1;
        }

        int key;
        while (file >> key) {
            inputKeys.push_back(key);
        }

        if (inputKeys.empty()) {
            cerr << "Error: No valid keys found in the file." << endl;
            return 1;
        }
    } else if (argc > 2) {
        for (int i = 1; i < argc; ++i) {
            inputKeys.push_back(atoi(argv[i]));
        }
    } else {
        cerr << "Usage: " << argv[0] << " <input_file> or provide keys as arguments." << endl;
        return 1;
    }

    cache.simulateRequestStream(inputKeys);
    cache.printStatsAsJSON();

    return 0;
}