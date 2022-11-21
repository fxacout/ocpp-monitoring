import pandas as pd
import numpy as np
import networkx as nx
r = np.random.RandomState(seed=5)
ints = r.random_integers(1, 10, size=(3,2))
a = ['A', 'B', 'C']
b = ['D', 'A', 'E']
df = pd.DataFrame(ints, columns=['weight', 'cost'])
df[0] = a
df['b'] = b
df
G=nx.from_pandas_dataframe(df, 0, 'b', ['weight', 'cost'])
G['E']['C']['weight']
G['E']['C']['cost']
