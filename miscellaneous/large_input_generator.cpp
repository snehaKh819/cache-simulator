// large_input_generator.cpp
#include <iostream>
#include <fstream>
#include <cstdlib>
#include <ctime>

using namespace std;

int main() {
    const int NUM_KEYS = 100000; // Change to 1,000,000 for very large test
    const int MAX_KEY = 1000000; // Max key value
    ofstream outFile("input_keys.txt");

    if (!outFile) {
        cerr << "Error: Could not open file for writing." << endl;
        return 1;
    }

    srand(static_cast<unsigned>(time(0)));

    for (int i = 0; i < NUM_KEYS; ++i) {
        int key = rand() % MAX_KEY;
        outFile << key;
        if (i < NUM_KEYS - 1) outFile << " , ";
    }

    outFile.close();
    cout << "Generated " << NUM_KEYS << " random keys in input_keys.txt" << endl;
    return 0;
}
